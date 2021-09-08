import { ParallelHasher } from "ts-md5/dist/parallel_hasher";

/**
 * 利用 WebWorker 计算md5值
 * @param fileBlob
 */
export async function calcMD5(fileBlob: Blob) {
  const hashHandler = new ParallelHasher("/md5_worker.js");
  const hash: string = await hashHandler.hash(fileBlob);
  return hash;
}
