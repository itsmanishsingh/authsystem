const { default: mongoose } = require("mongoose");

const { MONGODB_URL } = process.env;
mongoose.set('strictQuery', true);
exports.connect =()=>{
        mongoose
        .connect(MONGODB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(
            console.log(`DB Connection Successfully`)
        )
        .catch(error=>{
            console.log(`DB Connection Failed`);
            console.log(error);
            process.exit(1);
        });
};
