"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const app = (0, express_1.default)();
        app.use((0, morgan_1.default)('dev'));
        app.use((0, cors_1.default)());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(express_1.default.json());
        app.get('/api/v1/video-stream', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
            const resolved_path = './video.mp4';
            const fileSize = fs_1.default.statSync(resolved_path).size;
            const range = req.headers.range;
            const parts = range.replace(/bytes=/, '').split('-');
            const start = Number(parts[0]);
            const end = parts[1] ? Number(parts[1]) : 500000;
            if (start >= fileSize) {
                return res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
            }
            const chunksize = (end - start) + 1;
            const file = fs_1.default.createReadStream(resolved_path, { start, end });
            res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
            res.setHeader('Accept-Ranges', 'bytes');
            res.setHeader('Content-Length', chunksize);
            res.setHeader('Content-Type', 'video/mp4');
            return file.pipe(res);
        }));
        // Not Found
        app.use((_req, res, _next) => {
            return res.status(404).json({ success: false, message: 'Not Found' });
        });
        const port = 5000;
        app.listen(port, () => console.log(`🟢 Video Stream Server is Running on Port ${port}`));
    }
    catch (error) {
        return start();
    }
});
start();
//# sourceMappingURL=index.js.map