export const ENV: {
	IS_PROD: boolean;
	Access_Control_Allow_Origin: string;
} = {
	IS_PROD: true,
	Access_Control_Allow_Origin: '*',
};

export function initEnv(env: Record<string, any>) {
	for (const key in ENV) {
		if (env[key] !== undefined) {
			// @ts-ignore
			ENV[key] = env[key];
		}
	}
}
