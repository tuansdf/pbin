import { ENV } from "@/server/constants/env.constant";
import { vaultRepository } from "@/server/features/vault/vault.repository";
import { HashConfigs } from "@/server/features/vault/vault.type";
import {
  DEFAULT_HASHER,
  DEFAULT_ITERATIONS,
  DEFAULT_KEY_SIZE,
  FAKE_NONCE_SIZE,
  FAKE_SALT_SIZE,
  VAULT_EXPIRE_1_DAY,
  VAULT_EXPIRE_1_HOUR,
  VAULT_EXPIRE_1_MONTH,
  VAULT_EXPIRE_1_WEEK,
  VAULT_EXPIRE_4_MONTHS,
} from "@/shared/constants/common.constant";
import { handleRetry } from "@/shared/utils/common.util";
import { createHash } from "@/shared/utils/crypto.util";
import { hexToBytes } from "@noble/ciphers/utils";
import { fromByteArray } from "base64-js";
import dayjs from "dayjs";

export const handleVaultPublicIdCollision = async (randomFn: () => string) => {
  return await handleRetry({
    resultFn: randomFn,
    shouldRetryFn: vaultRepository.existsByPublicId,
  });
};

export const getVaultExpiredTime = (expiresAt?: number): number => {
  const sysdate = dayjs();
  let result = dayjs().valueOf();
  switch (expiresAt) {
    case VAULT_EXPIRE_1_HOUR:
      result = sysdate.add(1, "hour").valueOf();
      break;
    case VAULT_EXPIRE_1_DAY:
      result = sysdate.add(1, "day").valueOf();
      break;
    case VAULT_EXPIRE_1_WEEK:
      result = sysdate.add(1, "week").valueOf();
      break;
    case VAULT_EXPIRE_1_MONTH:
      result = sysdate.add(1, "month").valueOf();
      break;
    case VAULT_EXPIRE_4_MONTHS:
      result = sysdate.add(4, "month").valueOf();
      break;
    default:
      result = sysdate.add(1, "hour").valueOf();
  }
  return result;
};

const createBase = async (base: string) => {
  return createHash(base + ENV.SALT);
};

const HEX_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const MAX_ROUNDS = 16;
const MIN_ROUNDS = 2;
const BASE_CONTENT_EXTRA = "content";
const BASE_SALT_EXTRA = "salt";
const BASE_ENCRYPTION_EXTRA = "encryption";
export const generateFakeContent = async (base: string): Promise<string> => {
  base = (await createBase(base + BASE_CONTENT_EXTRA)).toLowerCase();
  let rounds = HEX_ALPHABET.indexOf(base[0]);
  if (rounds < MIN_ROUNDS) rounds = MIN_ROUNDS;
  if (rounds > MAX_ROUNDS) rounds = MAX_ROUNDS;
  rounds *= 2;
  const promises: Promise<string>[] = [];
  for (let i = 0; i < rounds; i++) {
    promises.push(createHash(base[i])); // select 1 character to shorten the hash input
  }
  const result = await Promise.all(promises);
  return fromByteArray(hexToBytes(result.join("")));
};

export const generateFakeHashConfigs = async (base: string): Promise<HashConfigs> => {
  base = await createBase(base + BASE_SALT_EXTRA);
  let keySize = DEFAULT_KEY_SIZE;
  let iterations = DEFAULT_ITERATIONS;
  let hasher = DEFAULT_HASHER;
  let salt = (await createHash(base)).substring(0, FAKE_SALT_SIZE);
  return { keySize, iterations, salt, hasher };
};

export const generateFakeEncryptionConfigs = async (base: string) => {
  base = await createBase(base + BASE_ENCRYPTION_EXTRA);
  return {
    nonce: (await createHash(base)).substring(0, FAKE_NONCE_SIZE),
  };
};