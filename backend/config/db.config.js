// Windows setup
// const dbConfig = {
//     HOST: "localhost",
//     USER: "postgres",
//     PASSWORD: "dbpassword123",
//     DB: "keeper",
//     PORT: 5432,
//     dialect: "postgres",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000,
//     }
// };
// Linux setup
const dbConfig = {
    HOST: "localhost",
    USER: "localhost",
    PASSWORD: "dbpassword123",
    DB: "keeper",
    PORT: 5433,
};

export default dbConfig;