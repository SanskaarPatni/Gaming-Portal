const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const config = require('config');
const router = express.Router();
const isAuth = require('./middleware/isauth');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

router.get("/", (req, res) => {
    res.send("Server is up and running");
});

mongoose
    .connect(config.get('MONGODB_URI'), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('MongoDB Connected!'))
    .catch(err => console.log(err));

// if (process.env.NODE_ENV === 'production') {
//     // Set a static folder
//     app.use(express.static('client/build'));
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });

// }

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});