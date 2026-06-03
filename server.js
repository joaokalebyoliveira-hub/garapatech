// server.js
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Payment } = require('mercadopago');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Permite que seu frontend acesse o backend

// Configure sua credencial do Mercado Pago (Chave Privada / Access Token)
// Para testes, você pega essa chave no painel de desenvolvedor do Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || 'SUBSTITUA_PELA_SUA_TEST_ACCESS_TOKEN'
});

// Banco de dados simulado de produtos para validação de preço (Segurança)
const PRODUTOS_LOJA = {
    1: { nome: "Processador Intel i7", preco: 1800.90 },
    2: { nome: "Placa-mãe AM4", preco: 699.90 },
    3: { nome: "Memória RAM 16GB", preco: 349.90 },
    4: { nome: "Monitor 28' LG", preco: 899.90 }
};

// Rota para processar o pagamento
app.post('/api/processar-pagamento', async(req, res) => {
    try {
        const { carrinho, metodoPagamento, emailUsuario } = req.body;

        if (!carrinho || carrinho.length === 0) {
            return res.status(400).json({ error: 'Carrinho vazio.' });
        }

        // 1. Recalcular o valor total direto do "Banco de Dados" para evitar fraudes no HTML
        let totalGeral = 0;
        carrinho.forEach(item => {
            const produtoReal = PRODUTOS_LOJA[item.id];
            if (produtoReal) {
                totalGeral += produtoReal.preco * item.quantidade;
            }
        });

        const payment = new Payment(client);

        // 2. Fluxo para pagamento via PIX
        if (metodoPagamento === 'pix') {
            const dadosPagamento = {
                body: {
                    transaction_amount: parseFloat(totalGeral.toFixed(2)),
                    description: 'Compra de Hardware na GARAPATECH',
                    payment_method_id: 'pix',
                    payer: {
                        email: emailUsuario || 'comprador_teste@garapatech.com',
                        first_name: 'Cliente',
                        last_name: 'Garapatech',
                        identification: {
                            type: 'CPF',
                            number: '00000000000' // Em produção, capture do formulário
                        }
                    },
                }
            };

            const resposta = await payment.create(dadosPagamento);

            // Retorna os dados do PIX real gerado pelo Banco Central/Gateway
            return res.json({
                sucesso: true,
                metodo: 'pix',
                idPagamento: resposta.id,
                qrCode: resposta.point_of_interaction.transaction_data.qr_code, // Chave copia e cola
                qrCodeBase64: resposta.point_of_interaction.transaction_data.qr_code_base64 // Imagem do QR Code
            });
        }

        // 3. Estrutura para Cartão de Crédito (Usa o Token seguro gerado pelo frontend)
        if (metodoPagamento === 'credito') {
            const { token, parcelas, bandeira } = req.body;

            const dadosPagamento = {
                body: {
                    transaction_amount: parseFloat(totalGeral.toFixed(2)),
                    token: token, // Token do cartão gerado de forma segura no frontend
                    description: 'Compra de Hardware na GARAPATECH',
                    installments: parseInt(parcelas),
                    payment_method_id: bandeira,
                    payer: {
                        email: emailUsuario || 'comprador_teste@garapatech.com'
                    }
                }
            };

            const resposta = await payment.create(dadosPagamento);

            if (resposta.status === 'approved') {
                return res.json({ sucesso: true, status: 'approved', metodo: 'credito' });
            } else {
                return res.status(400).json({ sucesso: false, status: resposta.status, mensagem: 'Cartão recusado.' });
            }
        }

        return res.status(400).json({ error: 'Método de pagamento não suportado ainda.' });

    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        res.status(500).json({ error: 'Erro interno no servidor de pagamento.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor GARAPATECH rodando na porta ${PORT}`));