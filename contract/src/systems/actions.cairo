// define the interface
#[starknet::interface]
trait IActions<TContractState> {
    fn create(self: @TContractState, name: felt252, age: u8) -> usize;
    fn remove(self: @TContractState, id: usize);
}

// dojo decorator
#[dojo::contract]
mod actions {
    use super::IActions;

    use torii_delete_issue::models::person::Person;

    // impl: implement functions specified in trait
    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        // ContractState is defined by system decorator expansion
        fn create(self: @ContractState, name: felt252, age: u8) -> usize {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();

            let id = world.uuid();

            set!(
                world,
                (
                    Person { id, name, age },
                )
            );

            id
        }

        fn remove(self: @ContractState, id: usize) {
            // Access the world dispatcher for reading.
            let world = self.world_dispatcher.read();

            let person = get!(world, id, (Person));

            delete!(world, (person));
        }
    }
}
