import * as React from "react"
import TokensComponent from "./TokensComponent"
import SectionComponent from "./SectionComponent"
import ErrorComponent from "./ErrorComponent"
import TreeComponent from "./TreeComponent"
import QueriesComponent from "./QueriesComponent"
import GraphsComponent from "./GraphsComponent"
import "./BodyComponent.css"
import { ReactElement } from "react"

export default function BodyComponent(): ReactElement {
  return (
    <div className="Body">
      <SectionComponent title="Error" path={["error"]}>
        <ErrorComponent />
      </SectionComponent>
      <SectionComponent title="Tokens" path={["parse", "tokens"]}>
        <TokensComponent />
      </SectionComponent>
      <SectionComponent title="Tree" path={["parse", "tree"]}>
        <TreeComponent />
      </SectionComponent>
      <SectionComponent title="Graph" path={["parse", "nodes"]}>
        <GraphsComponent parseProperty="nodes" />
      </SectionComponent>
      <SectionComponent
        title="Expanded Graph"
        path={["parse", "expanded_nodes"]}
      >
        <GraphsComponent parseProperty="expanded_nodes" />
      </SectionComponent>
      <SectionComponent title="Queries" path={["parse", "queries"]}>
        <QueriesComponent />
      </SectionComponent>
    </div>
  )
}
