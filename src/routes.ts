import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Email inválido ou senha com menos de 6 caracteres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "E-mail inválido ou A senha deve ter pelo menos 6 caracteres."
 *       409:
 *         description: Email já registrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Email já registrado."
 */
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({ error: 'Nome não pode ser vazio.' });
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Email já registrado.' });
    }
});


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Faz login de um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido com token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Email inválido ou senha com menos de 6 caracteres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "E-mail inválido ou A senha deve ter pelo menos 6 caracteres."
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Credenciais inválidas"
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro no servidor."
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ error: 'E-mail inválido.' });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '2h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Credenciais inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor.' });
    }
});

/**
 * @swagger
 * /welcome:
 *   get:
 *     summary: Retorna uma mensagem de boas-vindas
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mensagem de boas-vindas com detalhes do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bem-vindo ao sistema!"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       401:
 *         description: Token JWT inválido ou ausente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não autenticado."
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Usuário não encontrado."
 *       500:
 *         description: Erro ao buscar informações do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao buscar informações do usuário."
 */
router.get('/welcome', authenticateToken, async (req, res) => {
    try {
        if (!req.user || typeof req.user === 'string' || !('id' in req.user)) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, email: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.json({
            message: 'Bem-vindo ao sistema!',
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar informações do usuário.' });
    }
});

export default router;
