const { google } = require('googleapis');
const stream = require('stream');

const getDriveClient = (credentialsJson) => {
    try {
        const credentials = JSON.parse(credentialsJson);
        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/drive.file']
        });
        return google.drive({ version: 'v3', auth });
    } catch (e) {
        console.error("Erro nas credenciais do Google Drive:", e.message);
        return null;
    }
};

exports.uploadToDrive = async (fileName, fileContent, mimeType = 'application/json') => {
    const credentialsEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!credentialsEnv) {
        throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY não configurada no Render.");
    }

    const drive = getDriveClient(credentialsEnv);
    if (!drive) throw new Error("Não foi possível autenticar no Google Drive.");

    const bufferStream = new stream.PassThrough();
    bufferStream.end(Buffer.from(fileContent));

    const fileMetadata = {
        name: fileName,
        parents: process.env.GOOGLE_DRIVE_FOLDER_ID ? [process.env.GOOGLE_DRIVE_FOLDER_ID] : []
    };

    const media = {
        mimeType: mimeType,
        body: bufferStream
    };

    const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink'
    });

    return response.data;
};
