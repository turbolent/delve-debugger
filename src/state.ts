import { Cancel } from "./api"
import { Parse } from "./types"
import { Map } from "immutable"

export class State {
  private readonly map: Map<string, unknown>

  constructor(map: Map<string, unknown> = Map<string, unknown>()) {
    this.map = map
  }

  withMutations(mutator: (mutableState: State) => void): State {
    return new State(this.map.withMutations((map) => mutator(new State(map))))
  }

  get error(): string | undefined {
    return this.map.get("error") as string | undefined
  }

  withError(error?: string): State {
    return new State(this.map.set("error", error))
  }

  get requesting(): boolean {
    return this.cancel !== undefined
  }

  get parse(): Parse | undefined {
    return this.map.get("parse") as Parse | undefined
  }

  withParse(parse: Parse | undefined): State {
    return new State(this.map.set("parse", parse))
  }

  get cancel(): Cancel | undefined {
    return this.map.get("cancel") as Cancel | undefined
  }

  withCancel(cancel: Cancel | undefined): State {
    return new State(this.map.set("cancel", cancel))
  }

  get question(): string {
    return (this.map.get("question") as string | undefined) || ""
  }

  withQuestion(question: string): State {
    return new State(this.map.set("question", question))
  }
}
