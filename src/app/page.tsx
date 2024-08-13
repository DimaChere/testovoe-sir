"use client";
import styles from "./styles.module.sass";
import { Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepositories } from "@/redux/graphQL/features/data-manipulations";
import { RootState, AppDispatch } from "@/redux/graphQL/store";
import SearchResults from "@/components/table";
import Info from "@/components/info";

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searched, setSearched] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const dispatch = useDispatch<AppDispatch>();

    const onClickSearch = () => {
        dispatch(fetchRepositories(searchTerm));
        setSearched(true);
    };

    return (
        <main className={styles.main}>
            <div className={styles.searchField}>
                <input
                    type="text"
                    className={styles.inputField}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Поисковой запрос"
                />
                <Button
                    variant="contained"
                    size="large"
                    onClick={onClickSearch}
                >
                    ИСКАТЬ
                </Button>
            </div>

            <div className={styles.infoWrapper}>
                {searched ? (
                    <>
                        <div className={styles.tableWrapper}>
                            <SearchResults onRowClick={setSelectedRepo} />
                        </div>
                        <div className={styles.infoBlock}>
                            <Info repo={selectedRepo} />
                        </div>
                    </>
                ) : (
                    <div className={styles.hello}>
                        <span>Добро пожаловать</span>
                    </div>
                )}
            </div>
        </main>
    );
}
