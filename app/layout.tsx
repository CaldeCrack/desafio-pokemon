import type { Metadata } from "next";
import localFont from "next/font/local";
import SearchInput from "./components/SearchInput";
import Link from 'next/link';
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "PokeSearch",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
				/>
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<div className="flex flex-col gap-5 items-center mt-5">
					<Link href='/' passHref>
						<span className="text-2xl cursor-pointer">Búsqueda Pokémon</span>
					</Link>
					<SearchInput></SearchInput>
					{children}
				</div>

				<a
					href="https://github.com/CaldeCrack"
					target="_blank"
					rel="noopener noreferrer"
					className="fixed bottom-5 right-5 w-12 h-12 flex items-center justify-center bg-white rounded-full text-3xl text-gray-800 hover:text-white hover:bg-black transition duration-300"
					aria-label="Go to GitHub Profile">
					<i className="fab fa-github"></i>
				</a>
			</body>
		</html>
	);
}
