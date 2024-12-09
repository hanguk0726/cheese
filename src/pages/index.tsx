import Head from "next/head";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import VideoSearch from "@/components/VideoSearch";
import VideoStatisticsInfographic from "@/components/VideoStatisticsInfographic";

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

export default function Home() {
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="**TODO**" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div
                className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
            >
                <main className={styles.main}>
                    <div>
                        {/* <VideoSearch /> */}
                        <VideoStatisticsInfographic />
                    </div>
                </main>
                <footer className={styles.footer}>
                </footer>
            </div>
        </>
    );
}
