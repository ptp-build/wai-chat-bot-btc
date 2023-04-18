import { Str } from '@cloudflare/itty-router-openapi';
import WaiOpenAPIRoute from '../share/cls/WaiOpenAPIRoute';

const Body = {
	chatId: new Str({
		example: '1001',
		description: 'chat id',
	}),
	text: new Str({
		required: true,
		example: '/getBtcPrice',
		description: 'msg text',
	}),
};

const Commands = [
	{
		command: 'getBtcPrice',
		description: 'getBtcPrice',
	},
];

export class BotBtcCommandsAction extends WaiOpenAPIRoute {
	static schema = {
		tags: ['Btc'],
		responses: {
			'200': {
				schema: {},
			},
		},
	};
	async handle(request: Request, data: Record<string, any>) {
		return {
			commands: Commands,
		};
	}
}

export class BotBtcAction extends WaiOpenAPIRoute {
	static schema = {
		tags: ['Btc'],
		requestBody: Body,
		responses: {
			'200': {
				schema: {},
			},
		},
	};

	async handle(request: Request, data: Record<string, any>) {
		if (data.body) {
			const { text } = data.body;
			if (text) {
				if (text === '/getBtcPrice') {
					try {
						const res = await fetch('https://blockchain.info/ticker');
						if (res.status !== 200) {
							throw new Error(
								`fetch error: ${res.status},` +
									'````\n' +
									(await res.text()) +
									'```'
							);
						}
						const json = await res.json();
						console.log('res json', json);
						return WaiOpenAPIRoute.responseJson({
							text: `last price: ${json['USD']['last']}`,
						});
					} catch (e) {
						return WaiOpenAPIRoute.responseJson({
							text: `${e.message}`,
						});
					}
				}
			}
		}
		return WaiOpenAPIRoute.responseJson(
			{
				text: '',
			},
			200
		);
	}
}
