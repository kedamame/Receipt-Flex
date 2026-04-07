import { Attribution } from "ox/erc8021";
import { concatHex, encodeFunctionData, type Abi, type Address, type Hex } from "viem";
import { BUILDER_CODE } from "@/lib/app-config";

function getBuilderSuffix() {
  if (!BUILDER_CODE.startsWith("bc_") || BUILDER_CODE === "bc_your_builder_code") {
    return null;
  }

  try {
    return Attribution.toDataSuffix({ codes: [BUILDER_CODE] }) as Hex;
  } catch {
    return null;
  }
}

export function prepareBuilderTransaction({
  abi,
  args,
  functionName,
  to
}: {
  abi: Abi;
  args: readonly unknown[];
  functionName: string;
  to: Address;
}) {
  const calldata = encodeFunctionData({
    abi,
    args,
    functionName
  } as never);
  const suffix = getBuilderSuffix();

  return {
    to,
    data: suffix ? concatHex([calldata, suffix]) : calldata
  };
}
