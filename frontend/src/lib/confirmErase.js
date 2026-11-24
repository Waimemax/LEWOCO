// Permanent deletion needs a typed confirmation, so it cannot happen by a stray click.
export function confirmErase(description) {
  const answer = window.prompt(`${description}\n\nThis cannot be undone. Type DELETE to confirm.`)
  return answer !== null && answer.trim() === 'DELETE'
}
