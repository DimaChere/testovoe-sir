import React from "react";
import styles from "./Info.module.sass";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

export default function Info({ repo }: { repo: any }) {
    if (!repo) {
        return (
            <div className={styles.nothingChoose}>
                <span>Выберите репозитарий</span>
            </div>
        );
    }
    return (
        <div className={styles.infoContainer}>
            <h2 className={styles.repoName}>{repo.name}</h2>
            <div className={styles.mainLanguage}>
                <span className={styles.languageTag}>{repo.language}</span>
                <div className={styles.starCount}>
                    <StarRateRoundedIcon className={styles.starIcon} />
                    <span>{repo.stargazers}</span>
                </div>
            </div>
            <div className={styles.tagsContainer}>
                {repo.topics &&
                    repo.topics.map((topic: string, index: number) => (
                        <span key={index} className={styles.tag}>
                            {topic}
                        </span>
                    ))}
            </div>

            <div className={styles.license}>
                {repo.license ? repo.license : "License not specified"}
            </div>
        </div>
    );
}
