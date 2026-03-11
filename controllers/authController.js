const User = require('../models/userModel'); 

// --- KAYIT İŞLEMLERİ ---
exports.getRegister = (req, res) => {
    res.render('auth/register', { pageTitle: 'Kayıt Ol', errorMessage: null });
};

exports.postRegister = async (req, res) => {
    const { email, password, username } = req.body; 

    if (!username || username.trim().length < 3) {
        return res.render('auth/register', {
            pageTitle: 'Kayıt Ol', errorMessage: 'Kullanıcı adı en az 3 karakter olmalıdır.'
        });
    }
    if (!password || password.length < 6) {
        return res.render('auth/register', {
            pageTitle: 'Kayıt Ol', errorMessage: 'Şifre en az 6 karakter olmalıdır.'
        });
    }

    try {
        const user = new User({ email, password, username });
        await user.save();
        res.redirect('/login'); 
    } catch (error) {
        let errorMessage = 'Kayıt sırasında bir hata oluştu.';
        if (error.code === 11000) {
            if (error.keyPattern && error.keyPattern.username) {
                errorMessage = 'Bu kullanıcı adı zaten alınmıştır.';
            } else if (error.keyPattern && error.keyPattern.email) {
                errorMessage = 'Bu e-posta adresi zaten kayıtlıdır.';
            }
        } else if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            errorMessage = 'Eksik veya hatalı bilgi girdiniz: ' + errors.join(', ');
        }
        console.error("Kayıt Hatası Detayı:", error); 
        res.render('auth/register', { pageTitle: 'Kayıt Ol', errorMessage: errorMessage });
    }
};

// --- GİRİŞ İŞLEMLERİ ---
exports.getLogin = (req, res) => {
    res.render('auth/login', { pageTitle: 'Giriş Yap', errorMessage: null });
};

exports.postLogin = async (req, res) => {
    const { emailOrUsername, password } = req.body; 

    try {
        // Kullanıcı adı veya e-posta ile giriş
        const loginQuery = emailOrUsername.includes('@') 
            ? { email: emailOrUsername } 
            : { username: emailOrUsername }; 

        const user = await User.findOne(loginQuery);

        if (!user) {
            return res.render('auth/login', {
                pageTitle: 'Giriş Yap', errorMessage: 'Geçersiz kullanıcı adı/e-posta veya şifre.'
            });
        }
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.render('auth/login', {
                pageTitle: 'Giriş Yap', errorMessage: 'Geçersiz kullanıcı adı/e-posta veya şifre.'
            });
        }

        req.session.userId = user._id;
        res.redirect('/'); 
    } catch (error) {
        console.error(error);
        res.render('auth/login', { pageTitle: 'Giriş Yap', errorMessage: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }
};

// --- ÇIKIŞ İŞLEMİ ---
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Oturum sonlandırma hatası:', err);
        }
        res.redirect('/login');
    });
};


