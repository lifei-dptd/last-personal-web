const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const cors = require('cors');

// 初始化Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 数据文件路径
const VISITORS_FILE = path.join(__dirname, 'visitors.json');
const STATS_FILE = path.join(__dirname, 'stats.json');
const GUESTBOOK_FILE = path.join(__dirname, 'guestbook.json');

// 中间件
app.use(cors({
    origin: '*', // 允许所有来源
    methods: ['GET', 'POST'], // 允许的HTTP方法
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的请求头
}));
app.use(express.json());
app.use(express.static(__dirname)); // 提供静态文件服务

// 确保数据文件存在
function ensureDataFiles() {
    if (!fs.existsSync(VISITORS_FILE)) {
        fs.writeFileSync(VISITORS_FILE, JSON.stringify([], null, 2));
    }
    
    if (!fs.existsSync(STATS_FILE)) {
        fs.writeFileSync(STATS_FILE, JSON.stringify({
            totalVisitors: 0,
            todayVisitors: 0,
            lastResetDate: new Date().toISOString().split('T')[0]
        }, null, 2));
    }
    
    if (!fs.existsSync(GUESTBOOK_FILE)) {
        fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify([], null, 2));
    }
}

// 读取访客记录
function getVisitors() {
    try {
        return JSON.parse(fs.readFileSync(VISITORS_FILE, 'utf8'));
    } catch (error) {
        console.error('读取访客记录失败:', error);
        return [];
    }
}

// 保存访客记录
function saveVisitors(visitors) {
    try {
        fs.writeFileSync(VISITORS_FILE, JSON.stringify(visitors, null, 2));
        return true;
    } catch (error) {
        console.error('保存访客记录失败:', error);
        return false;
    }
}

// 读取留言记录
function getMessages() {
    try {
        return JSON.parse(fs.readFileSync(GUESTBOOK_FILE, 'utf8'));
    } catch (error) {
        console.error('读取留言记录失败:', error);
        return [];
    }
}

// 保存留言记录
function saveMessages(messages) {
    try {
        fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(messages, null, 2));
        return true;
    } catch (error) {
        console.error('保存留言记录失败:', error);
        return false;
    }
}

// 读取统计数据
function getStats() {
    try {
        return JSON.parse(fs.readFileSync(STATS_FILE, 'utf8'));
    } catch (error) {
        console.error('读取统计数据失败:', error);
        return {
            totalVisitors: 0,
            todayVisitors: 0,
            lastResetDate: new Date().toISOString().split('T')[0]
        };
    }
}

// 保存统计数据
function saveStats(stats) {
    try {
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
        return true;
    } catch (error) {
        console.error('保存统计数据失败:', error);
        return false;
    }
}

// 更新今日访客统计（如果需要）
function updateDailyStats() {
    const stats = getStats();
    const today = new Date().toISOString().split('T')[0];
    
    if (stats.lastResetDate !== today) {
        stats.todayVisitors = 0;
        stats.lastResetDate = today;
        saveStats(stats);
    }
    
    return stats;
}

// 生成随机token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// 管理员凭据验证
function verifyAdminCredentials(phone, password) {
    // 设置管理员凭据
    const ADMIN_PHONE = '17707179919';
    const ADMIN_PASSWORD = '20061018llf';
    
    return phone === ADMIN_PHONE && password === ADMIN_PASSWORD;
}

// API路由

// 管理员登录
app.post('/api/admin/login', (req, res) => {
    try {
        const { phone, password } = req.body;
        
        // 验证输入
        if (!phone || !password) {
            return res.status(400).json({ success: false, message: '请提供手机号和密码' });
        }
        
        // 验证管理员凭据
        if (!verifyAdminCredentials(phone, password)) {
            return res.status(401).json({ success: false, message: '手机号或密码错误' });
        }
        
        // 生成管理员token
        const token = generateToken();
        
        // 返回成功响应
        res.status(200).json({ 
            success: true, 
            message: '管理员登录成功',
            token
        });
    } catch (error) {
        console.error('管理员登录处理错误:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 管理员token验证
app.post('/api/admin/verify', (req, res) => {
    try {
        const { token } = req.body;
        
        // 这里简化处理，实际应用中应该验证token的有效性
        // 例如使用JWT或检查token是否在已登录管理员列表中
        if (!token || token.length !== 64) { // 我们生成的token是64个字符
            return res.status(401).json({ success: false, message: '无效的管理员token' });
        }
        
        res.status(200).json({ success: true, message: '管理员Token有效' });
    } catch (error) {
        console.error('管理员Token验证错误:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 访客登录
app.post('/api/login', (req, res) => {
    try {
        const { name, phone } = req.body;
        
        // 验证输入
        if (!name || !phone) {
            return res.status(400).json({ success: false, message: '请提供姓名和手机号码' });
        }
        
        if (!/^1[3-9]\d{9}$/.test(phone)) {
            return res.status(400).json({ success: false, message: '手机号码格式不正确' });
        }
        
        // 获取访客记录
        const visitors = getVisitors();
        
        // 检查是否已有相同手机号的访客
        const existingVisitorIndex = visitors.findIndex(v => v.phone === phone);
        
        let visitor;
        if (existingVisitorIndex >= 0) {
            // 更新已有访客信息
            visitor = visitors[existingVisitorIndex];
            visitor.name = name;
            visitor.lastVisit = new Date().toISOString();
            visitor.visitCount = (visitor.visitCount || 1) + 1;
            visitors[existingVisitorIndex] = visitor;
        } else {
            // 创建新访客记录
            visitor = {
                id: Date.now().toString(),
                name,
                phone,
                firstVisit: new Date().toISOString(),
                lastVisit: new Date().toISOString(),
                visitCount: 1
            };
            visitors.push(visitor);
            
            // 更新统计
            const stats = updateDailyStats();
            stats.totalVisitors += 1;
            stats.todayVisitors += 1;
            saveStats(stats);
        }
        
        // 保存访客记录
        if (!saveVisitors(visitors)) {
            return res.status(500).json({ success: false, message: '保存访客信息失败' });
        }
        
        // 生成token
        const token = generateToken();
        
        // 返回成功响应
        res.status(200).json({ 
            success: true, 
            message: '登录成功',
            token,
            visitor: {
                id: visitor.id,
                name: visitor.name,
                phone: visitor.phone,
                visitCount: visitor.visitCount,
                isFirstVisit: existingVisitorIndex < 0
            }
        });
    } catch (error) {
        console.error('登录处理错误:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 验证token（简化版本，实际应用中应该更安全）
app.post('/api/verify', (req, res) => {
    try {
        const { token } = req.body;
        
        // 这里简化处理，实际应用中应该验证token的有效性
        // 例如使用JWT或检查token是否在已登录列表中
        if (!token || token.length !== 64) { // 我们生成的token是64个字符
            return res.status(401).json({ success: false, message: '无效的token' });
        }
        
        res.status(200).json({ success: true, message: 'Token有效' });
    } catch (error) {
        console.error('Token验证错误:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 获取访客统计（受保护的路由）
app.get('/api/stats', (req, res) => {
    try {
        const stats = updateDailyStats();
        
        // 获取今日详细访客信息
        const today = new Date().toISOString().split('T')[0];
        const visitors = getVisitors();
        const todayVisitors = visitors.filter(v => 
            v.lastVisit && v.lastVisit.startsWith(today)
        );
        
        // 获取最近7天的访客数据
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentVisitors = visitors.filter(v => 
            new Date(v.firstVisit) >= sevenDaysAgo
        );
        
        // 按天统计最近7天的访客
        const dailyStats = {};
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyStats[dateStr] = 0;
        }
        
        recentVisitors.forEach(visitor => {
            const dateStr = visitor.firstVisit.split('T')[0];
            if (dailyStats.hasOwnProperty(dateStr)) {
                dailyStats[dateStr]++;
            }
        });
        
        res.status(200).json({ 
            success: true,
            data: {
                totalVisitors: stats.totalVisitors,
                todayVisitors: stats.todayVisitors,
                todayVisitorDetails: todayVisitors.map(v => ({
                    id: v.id,
                    name: v.name,
                    lastVisit: v.lastVisit,
                    visitCount: v.visitCount
                })),
                dailyStats: Object.entries(dailyStats).map(([date, count]) => ({
                    date,
                    count
                })).reverse(), // 按时间正序排列
                recentVisitorsCount: recentVisitors.length,
                averageVisitsPerDay: (stats.totalVisitors / 30).toFixed(2) // 假设网站运行30天
            }
        });
    } catch (error) {
        console.error('获取统计数据错误:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 获取所有访客记录（受保护的路由）
app.get('/api/visitors', (req, res) => {
    try {
        const { page = 1, limit = 20, search = '' } = req.query;
        const visitors = getVisitors();
        
        // 搜索过滤
        let filteredVisitors = visitors;
        if (search) {
            const searchLower = search.toLowerCase();
            filteredVisitors = visitors.filter(v => 
                v.name.toLowerCase().includes(searchLower) || 
                v.phone.includes(search)
            );
        }
        
        // 排序（按最后访问时间降序）
        filteredVisitors.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
        
        // 分页
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedVisitors = filteredVisitors.slice(startIndex, endIndex);
        
        res.status(200).json({ 
            success: true,
            data: {
                visitors: paginatedVisitors.map(v => ({
                    id: v.id,
                    name: v.name,
                    phone: v.phone,
                    firstVisit: v.firstVisit,
                    lastVisit: v.lastVisit,
                    visitCount: v.visitCount
                })),
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(filteredVisitors.length / parseInt(limit)),
                    totalRecords: filteredVisitors.length,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error('获取访客记录错误:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 留言板API

// 获取所有留言
app.get('/api/guestbook/messages', (req, res) => {
    try {
        const messages = getMessages();
        res.status(200).json({
            success: true,
            messages: messages
        });
    } catch (error) {
        console.error('获取留言错误:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 发布新留言
app.post('/api/guestbook/messages', (req, res) => {
    try {
        const { visitorName, visitorPhone, content } = req.body;
        
        // 验证输入
        if (!visitorName || !visitorPhone || !content) {
            return res.status(400).json({ 
                success: false, 
                message: '缺少必要信息' 
            });
        }
        
        if (content.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: '留言内容不能为空' 
            });
        }
        
        if (content.length > 500) {
            return res.status(400).json({ 
                success: false, 
                message: '留言内容不能超过500个字符' 
            });
        }
        
        // 验证手机号格式
        if (!/^1[3-9]\d{9}$/.test(visitorPhone)) {
            return res.status(400).json({ 
                success: false, 
                message: '手机号格式不正确' 
            });
        }
        
        // 获取现有留言
        const messages = getMessages();
        
        // 创建新留言
        const newMessage = {
            id: Date.now().toString(),
            visitorName: visitorName.trim(),
            visitorPhone: visitorPhone.trim(),
            content: content.trim(),
            createdAt: new Date().toISOString()
        };
        
        // 添加到留言列表
        messages.push(newMessage);
        
        // 保存留言
        if (!saveMessages(messages)) {
            return res.status(500).json({ 
                success: false, 
                message: '保存留言失败' 
            });
        }
        
        // 返回成功信息
        res.status(201).json({
            success: true,
            message: '留言发布成功',
            data: newMessage
        });
    } catch (error) {
        console.error('发布留言错误:', error);
        res.status(500).json({ success: false, message: '服务器错误' });
    }
});

// 添加路由来处理根路径
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 确保数据文件存在
ensureDataFiles();

// 本地开发环境启动服务器
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`服务器运行在 http://localhost:${PORT}`);
        console.log(`访客登录页面: http://localhost:${PORT}/`);
        console.log(`主页面: http://localhost:${PORT}/index.html`);
        console.log(`统计数据API: http://localhost:${PORT}/api/stats`);
    });
}

// 导出app用于Vercel和测试
module.exports = app;