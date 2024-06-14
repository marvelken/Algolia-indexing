// pages/api/updateAlgolia.js
import algoliasearch from 'algoliasearch';

// Initialize the Algolia client
const client = algoliasearch('T19D32MYUL', '5f5ca9e0f562329fb2cc6a00c3712141');
const index = client.initIndex('Directus');


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { trigger, record } = req.body;

  try {
    switch (trigger) {
      case 'create':
        await index.saveObject(record);
        break;
      case 'update':
        await index.partialUpdateObject(record);
        break;
      case 'delete':
        await index.deleteObject(record.id);
        break;
      default:
        throw new Error('Unsupported trigger');
    }

    res.status(200).json({ message: 'Success' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating Algolia', error: error.message });
  }
}
