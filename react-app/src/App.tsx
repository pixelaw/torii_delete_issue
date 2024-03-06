import {useComponentValue, useEntityQuery} from "@dojoengine/react";
import { Has, Entity } from "@dojoengine/recs";
import React, { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import {shortString} from "starknet";

const PersonTab = ({entityId, onRemove}: {entityId: Entity, onRemove: (id: number) => void}) => {
    const {
        setup: {
            clientComponents: { Person },
        },
    } = useDojo();

    const person = useComponentValue(Person, entityId)
    const numberName = Number(person.name)
    const hexName = `0x${numberName.toString(16)}`
    const name = shortString.decodeShortString(hexName)

    return (
      <div>
          {name} ({person.age})
          <button onClick={() => onRemove(person.id)}> Delete </button>
      </div>
    )
}

function App() {
    const {
        setup: {
            systemCalls: { create, remove },
            clientComponents: { Person },
        },
        account,
    } = useDojo();

    const [clipboardStatus, setClipboardStatus] = useState({
        message: "",
        isError: false,
    });

    const persons = useEntityQuery(
      [
        Has(Person)
      ]
    )

    const [name, setName] = React.useState('')
    const [age, setAge] = React.useState<null | number>(null)
    const handleRestoreBurners = async () => {
        try {
            await account?.applyFromClipboard();
            setClipboardStatus({
                message: "Burners restored successfully!",
                isError: false,
            });
        } catch (error) {
            setClipboardStatus({
                message: `Failed to restore burners from clipboard`,
                isError: true,
            });
        }
    };

    useEffect(() => {
        if (clipboardStatus.message) {
            const timer = setTimeout(() => {
                setClipboardStatus({ message: "", isError: false });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [clipboardStatus.message]);

    return (
        <>
            <button onClick={account?.create}>
                {account?.isDeploying ? "deploying burner" : "create burner"}
            </button>
            {account && account?.list().length > 0 && (
                <button onClick={async () => await account?.copyToClipboard()}>
                    Save Burners to Clipboard
                </button>
            )}
            <button onClick={handleRestoreBurners}>
                Restore Burners from Clipboard
            </button>
            {clipboardStatus.message && (
                <div className={clipboardStatus.isError ? "error" : "success"}>
                    {clipboardStatus.message}
                </div>
            )}

            <div className="card">
                select signer:{" "}
                <select
                    value={account ? account.account.address : ""}
                    onChange={(e) => account.select(e.target.value)}
                >
                    {account?.list().map((account, index) => {
                        return (
                            <option value={account.address} key={index}>
                                {account.address}
                            </option>
                        );
                    })}
                </select>
                <div>
                    <button onClick={() => account.clear()}>
                        Clear burners
                    </button>
                    <p>
                        You will need to Authorise the contracts before you can
                        use a burner. See readme.
                    </p>
                </div>
            </div>

            <div className="card">
                Name: <input value={name} onChange={(e) => setName(e.target.value)}/>
                Age: <input value={age ?? ''} onChange={(e) => setAge(e.target.valueAsNumber)} type={'number'}/>
                <button
                  onClick={() => {
                      create(account.account, name, age)
                      setName('')
                      setAge(null)
                  }}
                >
                    Create
                </button>
            </div>

            <div className="card">
                Persons
                {persons.map(person => (
                  <PersonTab entityId={person} onRemove={(id) => {
                      remove(account.account, id).then(() => window.location.reload())
                  }} key={person} />
                ))}
            </div>
        </>
    );
}

export default App;
