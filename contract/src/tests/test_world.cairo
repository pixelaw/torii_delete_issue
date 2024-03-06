#[cfg(test)]
mod tests {
    use starknet::class_hash::Felt252TryIntoClassHash;

    // import world dispatcher
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

    // import test utils
    use dojo::test_utils::{spawn_test_world, deploy_contract};

    // import test utils
    use torii_delete_issue::{
        systems::{actions::{actions, IActionsDispatcher, IActionsDispatcherTrait}},
        models::person::{Person, person}
    };

    const NAME: felt252 = 'Bob';
    const AGE: u8 = 25;

    #[test]
    #[available_gas(30000000)]
    fn test_create() {
        // caller
        let caller = starknet::contract_address_const::<0x0>();

        // models
        let mut models = array![person::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        // call create()
        let id = actions_system.create(NAME, AGE);

        // Check world state
        let person = get!(world, id, Person);

        // check name
        assert(person.name == NAME, 'name is wrong');

        // check age
        assert(person.age == AGE, 'age is wrong');
    }

    #[test]
    #[available_gas(30000000)]
    fn test_remove() {
        // caller
        let caller = starknet::contract_address_const::<0x0>();

        // models
        let mut models = array![person::TEST_CLASS_HASH];

        // deploy world with models
        let world = spawn_test_world(models);

        // deploy systems contract
        let contract_address = world
            .deploy_contract('salt', actions::TEST_CLASS_HASH.try_into().unwrap());
        let actions_system = IActionsDispatcher { contract_address };

        // call create()
        let id = actions_system.create(NAME, AGE);

        actions_system.remove(id);

        // Check world state
        let person = get!(world, id, Person);

        // check name
        assert(person.name == '', 'name is wrong');

        // check age
        assert(person.age == 0, 'age is wrong');
    }


}
