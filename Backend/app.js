const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { UserInfo, Chatbot, ChatHistory } = require('./models'); // ✅ Updated import

const mongoURI = '#####';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected...');
        createUserAndChatbot();
    })
    .catch((err) => console.error('MongoDB connection error:', err));

async function createUserAndChatbot() {
    try {
        const hashedPassword = await bcrypt.hash('your_password_here', 10);

        const user = new UserInfo({
            first_name: 'John',
            last_name: 'Doe',
            designation: 'Engineer',
            age_group: '26-35',
            email: 'john.doe@example.com',
            password: hashedPassword
        });

        await user.save();
        console.log('User created with custom ID:', user.user_id);

        const chatbotName = 'MyFirstBot';
        const folderPath = path.join(__dirname, 'faiss_indexes');
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

        const faissPath = path.join(folderPath, `${user.user_id}.faiss`);
        const pklPath = path.join(folderPath, `${user.user_id}.pkl`);
        fs.writeFileSync(faissPath, 'Simulated FAISS index content...');
        fs.writeFileSync(pklPath, 'Simulated Pickle data...');

        const chatbot = new Chatbot({
            user_id: user.user_id,
            chatbot_name: chatbotName,
            input_type: 'pdf',
            pdf_file: {
                filename: 'sample.pdf',
                data: Buffer.from('Dummy PDF content...'),
                content_type: 'application/pdf'
            },
            website_url: null,
            faiss_index: {
                index_faiss: fs.readFileSync(faissPath),
                index_pkl: fs.readFileSync(pklPath)
            }
        });

        await chatbot.save();
        console.log(`Chatbot '${chatbotName}' created for ${user.user_id}`);

        // ✅ Create Sample Chat History
        const chatHistory = new ChatHistory({
            user_id: user.user_id,
            bot_id: chatbot._id,
            messages: [
                { role: 'user', content: 'What is this PDF about?' },
                { role: 'bot', content: 'This PDF is about a simulated topic...' }
            ]
        });

        await chatHistory.save();
        console.log('Sample chat history added.');

    } catch (err) {
        console.error('Error during creation:', err.message);
    } finally {
        mongoose.disconnect();
    }
}

