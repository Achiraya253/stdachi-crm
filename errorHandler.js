const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // แสดง error stack ในโหมด development
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // ส่งคำตอบกลับ
    res.status(statusCode).json({
        error: {
            message: message
        }
    });
};

module.exports = errorHandler;
