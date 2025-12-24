import { Router } from 'express';
import { OrganizationController } from '../controllers/organization.controller';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// 上传Excel文件
router.post('/upload', upload.single('file'), OrganizationController.uploadExcel);

// 获取组织架构树
router.get('/tree', OrganizationController.getTree);

// 获取所有节点
router.get('/nodes', OrganizationController.getAllNodes);

// 获取单个节点
router.get('/nodes/:id', OrganizationController.getNodeById);

export default router;

