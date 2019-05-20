export async function delay(seconds: number): Promise<void> {

  await new Promise((r, e) => setTimeout(() => r(null), seconds));

}
