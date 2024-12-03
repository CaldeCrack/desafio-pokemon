import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
				pathname: "/**",
			},
		],
	},
	devIndicators: {
		appIsrStatus: false,
	}
};

export default nextConfig;
