import { Router } from 'express';
import { createPart, deletePart, getCategories, getPartById, getParts, updatePart } from '#controllers';
import { authenticate, authorize, validateBody } from '#middlewares';
import { partCreateSchema, partUpdateSchema } from '#schemas';

const partsRouter = Router();

// public
partsRouter.get('/', getParts);
partsRouter.get('/categories', getCategories); // before /:id
partsRouter.get('/:id', getPartById);

// admin
partsRouter.post('/', authenticate, authorize('admin'), validateBody(partCreateSchema), createPart);
partsRouter.put('/:id', authenticate, authorize('admin'), validateBody(partUpdateSchema), updatePart);
partsRouter.delete('/:id', authenticate, authorize('admin'), deletePart);

export default partsRouter;
