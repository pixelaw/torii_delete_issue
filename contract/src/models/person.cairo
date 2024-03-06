#[derive(Model, Drop, Serde)]
struct Person {
    #[key]
    id: usize,
    name: felt252,
    age: u8
}
