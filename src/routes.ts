import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

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

export default router;
