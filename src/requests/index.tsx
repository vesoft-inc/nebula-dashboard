import { _delete, post } from '@/utils/http';
import { BatchQueryItem } from '@/utils/interface';

export let asyncBatchQueries = async (
  queries: BatchQueryItem[],
  config?,
) => {
  // const res = await post(`/api/v1/metric/batchquery`)(
  //   {
  //     queries,
  //   },
  //   config,
  // );
  // return res.data;
};

export const updateRequest = (request: { 
  asyncBatchQueries: (
    queries: BatchQueryItem[],
    config?,
  ) => Promise<any>;
}) => {
  asyncBatchQueries = request.asyncBatchQueries;
}