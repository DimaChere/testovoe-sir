import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { gql, GraphQLClient } from "graphql-request";

// Интерфейс для описания языка
interface PrimaryLanguage {
    name: string;
}

// Интерфейс для описания данных репозитория
interface RepoData {
    name: string;
    description: string;
    forks: number;
    stargazers: number;
    updatedAt: string;
    language: string;
    topics: string[];
}

// Состояние Redux для хранения данных репозиториев
interface GitHubState {
    repositories: RepoData[];
    loading: boolean;
    error: string | null;
}

// Интерфейс для ответа от GitHub API
interface RepositoriesResponse {
    search: {
        edges: {
            node: {
                name: string;
                description: string;
                forkCount: number;
                stargazerCount: number;
                updatedAt: string;
                primaryLanguage: PrimaryLanguage;
                repositoryTopics: {
                    nodes: { topic: { name: string } }[];
                };
            };
        }[];
    };
}

// Начальное состояние
const initialState: GitHubState = {
    repositories: [],
    loading: false,
    error: null,
};

// URL API GitHub и токен аутентификации
const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN is not set");
}

// Создание клиента GraphQL
const client = new GraphQLClient(GITHUB_API_URL, {
    headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
    },
});

// Запрос GraphQL для получения репозиториев с темами
const GET_REPOS_QUERY = gql`
    query GetRepositories($searchTerm: String!) {
        search(query: $searchTerm, type: REPOSITORY, first: 100) {
            edges {
                node {
                    ... on Repository {
                        name
                        description
                        forkCount
                        stargazerCount
                        updatedAt
                        primaryLanguage {
                            name
                        }
                        repositoryTopics(first: 10) {
                            nodes {
                                topic {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;

// Асинхронное действие для получения данных репозиториев
export const fetchRepositories = createAsyncThunk(
    "github/fetchRepositories",
    async (searchTerm: string) => {
        const data = await client.request<RepositoriesResponse>(
            GET_REPOS_QUERY,
            { searchTerm }
        );

        // Обработка данных, с проверкой на наличие topics
        return data.search.edges.map((edge) => ({
            name: edge.node.name,
            description: edge.node.description,
            forks: edge.node.forkCount,
            stargazers: edge.node.stargazerCount,
            updatedAt: edge.node.updatedAt,
            language: edge.node.primaryLanguage?.name || "Не указан",
            topics: edge.node.repositoryTopics?.nodes?.map(
                (node) => node.topic.name
            ),
        }));
    }
);

// Создание слайса Redux
const githubSlice = createSlice({
    name: "github",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRepositories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchRepositories.fulfilled,
                (state, action: PayloadAction<RepoData[]>) => {
                    state.repositories = action.payload;
                    state.loading = false;
                }
            )
            .addCase(fetchRepositories.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.error.message || "Failed to fetch repositories";
            });
    },
});

// Экспорт редьюсера по умолчанию
export default githubSlice.reducer;
