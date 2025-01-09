import Head from "next/head";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import SearchBar from "@/components/domain/SearchBar";
import videoStore from "@/data/store/video";
import CategoryStatisticsTable from "@/components/domain/CategoryStatistics";
import appStore from "@/data/store/app";
import VideoChart from "@/components/domain/VideoChart";
import Heatmap from "@/components/domain/Heatmap";

// MobX 트랜스파일러 설정 검증 코드
if (!new class { x:any }().hasOwnProperty('x')) {
    throw new Error('Transpiler is not configured correctly');
}

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
    const recordComponents = {
        statistics: <CategoryStatisticsTable />,
        chart: <VideoChart />,
        heatmap: <span />
    };
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
                    <SearchBar />
                    {recordComponents[appStore.recordType]}
                </main>
                <footer className={styles.footer}>
                </footer>
            </div>
        </>
    );
}
