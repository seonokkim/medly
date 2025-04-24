import { BadRequestException, Injectable } from '@nestjs/common';
import { AzureOpenAI } from 'openai';
import '@azure/openai/types';
import { handlingError } from 'src/common/utils/handlingError';
import { ChatUserHistoriesService } from '../chatUserHistories/chatUserHistories.service';
import { ChatBotHistoriesService } from '../chatBotHistories/chatBotHistories.service';
import {
  RequestAzureOpenAiGptDto,
  RequestAzureOpenAiGptParamDto,
} from './dto/RequestAzureOpenAiGpt.dto';
import {
  FindAllChatsParamDto,
  FindAllChatsQueryDto,
} from './dto/FindAllChats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatUserHistoriesEntity } from '../chatUserHistories/entities/chatUserHistories.entity';
import { Repository } from 'typeorm';
import { DoctorsEntity } from '../doctors/entities/doctor.entity';
import { HttpService } from '@nestjs/axios';
import { GetChatbotAnswerDto } from './dto/GetChatbotAnswer.dto';
import { firstValueFrom } from 'rxjs';

// citation HTML 문자열을 파싱하는 헬퍼 함수
function parseCitation(citation: string): { name: string; content: string }[] {
  if (!citation) return [];
  // 각 <details> 블록에서 <summary>와 첫번째 <span>의 내용을 추출 (예시)
  const regex =
    /<details>[\s\S]*?<summary>(.*?)<\/summary>[\s\S]*?<h3>Original Text<\/h3>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<h3>Data Sources<\/h3>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<\/details>/g;
  const citations: { name: string; content: string }[] = [];
  let match;
  while ((match = regex.exec(citation)) !== null) {
    citations.push({
      name: match[1].trim(),
      content: `${match[2].trim()}${'\n\n'}${match[3]
        .replace(/<\/?b>/g, '')
        .replace(/, /g, '\n')
        .trim()}`,
    });
  }
  return citations;
}

function parsePlainCitation(
  citation: string,
): { name: string; content: string }[] {
  // "Doc"으로 시작하는 각 항목을 쉼표 기준으로 분리합니다.
  if (!citation) return [];
  const parts = citation.split(/,\s*(?=Doc)/);
  return parts.map((part, index) => {
    // "DocX : 내용" 형태의 패턴을 추출합니다.
    const match = part.match(/^(Doc\d+)\s*:\s*([\s\S]*)$/);

    if (match) {
      return {
        name: match[1].trim(),
        content: match[2].trim(),
      };
    }
    // 패턴 매칭이 실패할 경우, 강제로 "Doc{index+1}" 이름을 부여합니다.
    return {
      name: `Doc${index + 1}`,
      content: part.trim(),
    };
  });
}

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatUserHistoriesEntity)
    private chatUserHistoriesRepository: Repository<ChatUserHistoriesEntity>,
    private chatUserHistoriesService: ChatUserHistoriesService,
    private chatBotHistoriesService: ChatBotHistoriesService,
    private readonly httpService: HttpService,
  ) {}

  // createMessage(): ChatCompletionCreateParamsNonStreaming {
  //   return {
  //     messages: [
  //       { role: 'system', content: '' },
  //       { role: 'user', content: '' },
  //     ],
  //     model: '', // model == deployment name
  //   };
  // }

  async requestAzureOpenAiGpt(
    requestAzureOpenAiGptParamDto: RequestAzureOpenAiGptParamDto,
    requestAzureOpenAiGptDto: RequestAzureOpenAiGptDto,
  ) {
    const endpoint = process.env['AZURE_OPENAI_ENDPOINT'];
    const apiKey = process.env['AZURE_OPENAI_API_KEY'];

    const apiVersion = '2024-12-01-preview';
    const deploymentName = 'gpt-4o-doc-search';

    const messages = requestAzureOpenAiGptDto.messages;

    try {
      const client = new AzureOpenAI({
        endpoint,
        apiKey,
        apiVersion,
        deployment: deploymentName,
      });

      const response = await client.chat.completions.create({
        // stream: true,
        messages: [
          {
            role: 'system',
            content: '사용자에게 도움을 주는 AI 도우미입니다.',
          },
          { role: 'user', content: messages },
        ],
        model: deploymentName,
      });

      const query = await this.chatUserHistoriesService.createOne({
        query: messages,
        doctorIdx: requestAzureOpenAiGptParamDto.doctorIdx,
        model: null,
      });

      this.chatBotHistoriesService.createOne(
        {
          answer: response.choices[0].message.content,
          citation: null,
          queryIdx: query.idx,
        },
        requestAzureOpenAiGptParamDto.doctorIdx,
      );

      // response 프로퍼티 중 stream: true로 설정했을 때 사용
      // let result = '';
      // for await (const event of response) {
      //   console.log(event.choices);
      //   for (const choice of event.choices) {
      //     const newText = choice.delta?.content;
      //     if (newText) {
      //       result += newText;
      //       // To see streaming results as they arrive, uncomment line below
      //       // console.log(newText);
      //     }
      //   }
      // }

      return (({ choices, model, usage }) => ({ choices, model, usage }))(
        response,
      );
    } catch (err) {
      console.log(err);
      handlingError(err);
    }
  }

  // axios 사용하여 외부 flask 서버에 요청
  async getChatbotAnswer(getChatbotAnswerDto: GetChatbotAnswerDto) {
    const flaskUrl =
      getChatbotAnswerDto.model === '문헌 검색'
        ? 'https://chatbots-atcagjapebcjb7hb.eastus2-01.azurewebsites.net/chat'
        : getChatbotAnswerDto.model === 'PatientCareGPT'
          ? 'https://patientcaregpt-webapp-e7gpcqbyhsd6hvcj.eastus2-01.azurewebsites.net/chat'
          : getChatbotAnswerDto.model === 'MedSurgGPT'
            ? 'https://doc-flask-app-aefrh4bafge6ageb.eastus2-01.azurewebsites.net/chat'
            : getChatbotAnswerDto.model === 'MedBioGPT'
              ? 'https://medbiogpt-flask-ecbmadcgg0b4cvb0.eastus2-01.azurewebsites.net/chat'
              : (() => {
                  throw new BadRequestException('모델명이 잘못되었습니다.');
                })();

    const histories = this.chatUserHistoriesRepository.find({
      where: {
        doctor: { idx: getChatbotAnswerDto.doctorIdx },
        model: getChatbotAnswerDto.model,
      },
      relations: {
        chatBotHistory: true,
      },
    });

    const result = (await histories).map((history) => {
      const query = history.query;
      const answer = history.chatBotHistory?.answer || '';
      return [query, answer];
    });

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          flaskUrl,
          getChatbotAnswerDto.model == '문헌 검색'
            ? {
                chatbot_type: getChatbotAnswerDto.mode,
                prompt: getChatbotAnswerDto.messages,
                histories: result,
              }
            : {
                prompt: getChatbotAnswerDto.messages,
                histories: result,
              },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const query = await this.chatUserHistoriesService.createOne({
        query: getChatbotAnswerDto.messages,
        doctorIdx: getChatbotAnswerDto.doctorIdx,
        model: getChatbotAnswerDto.model,
      });

      const answer = await this.chatBotHistoriesService.createOne(
        {
          answer: response.data.response,
          citation: response.data.citations,
          queryIdx: query.idx,
        },
        getChatbotAnswerDto.doctorIdx,
      );

      return [
        {
          idx: query.idx,
          text: query.query,
          type: 'sent',
          citation: [],
        },
        {
          idx: answer.idx,
          text: answer.answer,
          type: 'received',
          citation:
            getChatbotAnswerDto.model != '문헌 검색'
              ? parseCitation(answer.citation || '')
              : parsePlainCitation(answer.citation || ''),
        },
      ];
    } catch (err) {
      console.log(err);
      handlingError(err);
    }
  }

  async findAll(
    findAllChatsParamDto: FindAllChatsParamDto,
    findAllChatsQueryDto: FindAllChatsQueryDto,
  ) {
    const doctor = new DoctorsEntity();
    doctor.idx = findAllChatsParamDto.doctorIdx;
    const histories = await this.chatUserHistoriesRepository.find({
      where: {
        model: findAllChatsQueryDto.model,
        doctor: doctor,
      },
      order: {
        createdAt: 'ASC',
      },
      relations: {
        chatBotHistory: true,
      },
    });

    // 각 기록에서 부모의 query와 자식의 answer를 분리하여 flat array로 구성
    const messages = histories.flatMap((history) => {
      const sentMessage = {
        idx: history.idx,
        text: history.query,
        type: 'sent', // 부모 엔티티의 경우
        citation: [] as { name: string; content: string }[],
      };

      const receivedMessage = {
        idx: history.chatBotHistory?.idx,
        text: history.chatBotHistory?.answer || '',
        type: 'received', // chatBotHistory인 경우
        citation:
          findAllChatsQueryDto.model != '문헌 검색'
            ? parseCitation(history.chatBotHistory?.citation || '')
            : parsePlainCitation(history.chatBotHistory?.citation || ''),
      };

      return [sentMessage, receivedMessage];
    });

    return messages;

    // const results = histories.reduce(
    //   (result, history) => {
    //     result.citations.push(history.chatBotHistory.citation || '');
    //     result.histories.push([
    //       history.query,
    //       history.chatBotHistory?.answer || '',
    //     ]);
    //     return result;
    //   },
    //   { citations: [] as string[], histories: [] as [string, string][] },
    // );

    // return { ...results, response: '' };
  }
}
