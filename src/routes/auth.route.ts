import { Router } from "express"
import Authenticate from "../middleware/Authenticate";
import authController from "../controller/auth.controller";
const router = Router();

router.post('/google', authController.googleAuth);
router.post('/new-accessToken', authController.getNewAccessToken);
router.get('/logged-user', Authenticate, authController.getLoggedUser);
router.delete('/', Authenticate, authController.deleteAccount);

export default router