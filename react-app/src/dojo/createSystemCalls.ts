import {AccountInterface, shortString} from "starknet";
import { Entity } from "@dojoengine/recs";
import { ClientComponents } from "./createClientComponents";
import {
    getEntityIdFromKeys,
    getEvents,
    setComponentsFromEvents,
} from "@dojoengine/utils";
import { ContractComponents } from "./generated/contractComponents";
import type { IWorld } from "./generated/generated";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

const uuid = function (x: number) {
    if (x < 0 || x > 53) {
        return NaN;
    }
    const n = 0 | (Math.random() * 0x40000000); // 1 << 30
    return x > 30 ? n + (0 | (Math.random() * (1 << (x - 30)))) * 0x40000000 : n >>> (30 - x);
};


export function createSystemCalls(
    { client }: { client: IWorld },
    contractComponents: ContractComponents,
    { Person }: ClientComponents
) {
    const create = async (account: AccountInterface, name: string, age: number) => {
        const personId = uuid(32)

        const entityId = getEntityIdFromKeys([
            BigInt(personId),
        ]) as Entity;

        Person.addOverride(personId, {
            entity: entityId,
            value: { id: personId, name: BigInt(shortString.encodeShortString(name)), age },
        });

        try {
            const { transaction_hash } = await client.actions.create({
                account, name, age
            });

            setComponentsFromEvents(
                contractComponents,
                getEvents(
                    await account.waitForTransaction(transaction_hash, {
                        retryInterval: 100,
                    })
                )
            );
        } catch (e) {
            console.log(e);
            Person.removeOverride(personId);
        } finally {
            Person.removeOverride(personId);
        }
    };

    const remove = async (account: AccountInterface, id: number) => {

        try {
            const { transaction_hash } = await client.actions.remove({
                account, id
            });

            setComponentsFromEvents(
              contractComponents,
              getEvents(
                await account.waitForTransaction(transaction_hash, {
                    retryInterval: 100,
                })
              )
            );
        } catch (e) {
            console.log(e);
        }
    };

    return {
        create,
        remove,
    };
}
