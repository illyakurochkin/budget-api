import request from 'supertest';
import { createServer } from '../../app';

describe('block resolver', () => {
  describe('query getBlocks', () => {
    it('should find blocks by `userId` and `sourceId`', async () => {
      const app = await createServer();

      const query = `
        query ($userId: String!, $sourceId: String!) {
          blocks: getBlocks(userId: $userId, sourceId: $sourceId) {
            id
          }
        }
      `;

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200);

      const { blocks } = response.body.data;
      // expect()
    });
  });
});
