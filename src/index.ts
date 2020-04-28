/**
 * This function says hello.
 * @param name Some name to say hello for.
 * @returns The hello.
 */
const sayHello = (name: string = "Fab"): string => `Hello, ${name}!`;

console.log(sayHello());

export default sayHello;
