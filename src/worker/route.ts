import { ENV } from './env';
import { SWAGGER_DOC } from './setting';
import { getCorsOptionsHeader } from './share/utils/utils';
import { OpenAPIRouter } from '@cloudflare/itty-router-openapi';
import { BotBtcAction, BotBtcCommandsAction } from './controller/BotBtcController';
import WaiOpenAPIRoute from './share/cls/WaiOpenAPIRoute';

export async function handleEvent({ request }: { request: Request }) {
	try {
		return await router.handle(request);
	} catch (e) {
		console.error(e.stack);
		return WaiOpenAPIRoute.responseError('system error');
	}
}

const router = OpenAPIRouter(SWAGGER_DOC);

router.all('*', async (request: Request) => {
	if (request.method === 'OPTIONS') {
		return new Response('', {
			headers: {
				...getCorsOptionsHeader(ENV.Access_Control_Allow_Origin),
			},
		});
	}
});

router.post('/api/btc/message', BotBtcAction);
router.post('/api/btc/commands', BotBtcCommandsAction);
router.original.get('/', request => Response.redirect(`${request.url}docs`, 302));
router.all('*', () => new Response('Not Found.', { status: 404 }));
