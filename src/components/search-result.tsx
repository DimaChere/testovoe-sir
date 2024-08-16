"use client";
import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/graphQL/store";
import TableSkeleton from "./skeletons/table-skeleton";

const columns: GridColDef[] = [
    { field: "name", headerName: "Название", flex: 1 },
    { field: "language", headerName: "Язык", flex: 1 },
    { field: "forks", headerName: "Число форков", type: "number", flex: 1 },
    {
        field: "stargazers",
        headerName: "Число звёзд",
        type: "number",
        flex: 1,
    },
    { field: "updatedAt", headerName: "Дата обновления", flex: 1 },
];

export default function SearchResults({
    onRowClick,
}: {
    onRowClick: (repo: any) => void;
}) {
    const { repositories, loading, error } = useSelector(
        (state: RootState) => state.github
    );

    if (loading)
        return (
            <div>
                <TableSkeleton />
            </div>
        );
    if (error) return <p>Ошибка: {error}</p>;

    return (
        <div>
            <DataGrid
                rows={repositories.map((repo, index) => ({
                    id: index + 1,
                    name: repo.name,
                    language: repo.language || "Не указан",
                    forks: repo.forks,
                    stargazers: repo.stargazers,
                    updatedAt: new Date(repo.updatedAt).toLocaleDateString(),
                    description: repo.description,
                    topics: repo.topics,
                }))}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10, 20, 30, 40]}
                onRowClick={(params) => onRowClick(params.row)}
            />
        </div>
    );
}
