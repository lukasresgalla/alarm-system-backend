import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 3006;

app.use(cors());
app.use(express.json());

// Endpoint para enviar notificação
app.post('/notificar', async (req, res) => {
  const { email, assunto, mensagem } = req.body;

  // Configurar o serviço de email (usando um exemplo com Gmail e OAuth2)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lukasresgalla@gmail.com',
      pass: 'yntb nlva luyk fbhj' // ou melhor: use variáveis de ambiente
    }
  });

  const mailOptions = {
    from: 'lukassresgalla@gmail.com',
    to: "lukasresgalla@gmail.com",
    subject: assunto,
    text: mensagem
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Notificação enviada para ${email}`);
    res.status(200).json({ message: 'Notificação enviada com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    res.status(500).json({ error: 'Erro ao enviar notificação' });
  }
});

app.listen(PORT, () => {
  console.log(`Serviço de Notificação rodando na porta ${PORT}`);
});
