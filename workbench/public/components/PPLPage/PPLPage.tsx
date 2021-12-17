/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */


import React from "react";
import {
  EuiPanel,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiCodeEditor,
  EuiSpacer,
  EuiCodeBlock,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from "@elastic/eui";
import { ResponseDetail, TranslateResult } from '../Main/main';
import _ from 'lodash';

interface PPLPageProps {
  onRun: (query: string) => void,
  onTranslate: (query: string) => void,
  onClear: () => void,
  updatePPLQueries: (query: string) => void,
  pplQuery: string,
  pplTranslations: ResponseDetail<TranslateResult>[]
}

interface PPLPageState {
  pplQuery: string,
  translation: string,
  isModalVisible: boolean
}

export class PPLPage extends React.Component<PPLPageProps, PPLPageState> {
  constructor(props: PPLPageProps) {
    super(props);
    this.state = {
      pplQuery: this.props.pplQuery,
      translation: "",
      isModalVisible: false
    };
  }

  setIsModalVisible(visible: boolean): void {
    this.setState({
      isModalVisible: visible
    })
  }

  render() {

    const closeModal = () => this.setIsModalVisible(false);
    const showModal = () => this.setIsModalVisible(true);

    const pplTranslationsNotEmpty = () => {
      if (this.props.pplTranslations.length > 0) {
        return this.props.pplTranslations[0].fulfilled;
      }
      return false;
    }

    const explainContent = pplTranslationsNotEmpty()
      ? this.props.pplTranslations.map((queryTranslation: any) => JSON.stringify(queryTranslation.data, null, 2)).join("\n")
      : 'This query is not explainable.';

    let modal;

    if (this.state.isModalVisible) {
      modal = (
        <EuiOverlayMask onClick={closeModal}>
          <EuiModal onClose={closeModal} style={{ width: 800 }}>
            <EuiModalHeader>
              <EuiModalHeaderTitle>Explain</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              <EuiCodeBlock
                language="json"
                fontSize="m"
                isCopyable
              >
                {explainContent}
              </EuiCodeBlock>
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButton onClick={closeModal} fill>
                Close
            </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      );
    }

    return (
      <EuiPanel className="sql-console-query-editor container-panel" paddingSize="l">
        <EuiText className="sql-query-panel-header"><h3>Query editor</h3></EuiText>
        <EuiSpacer size="s" />
        <EuiCodeEditor
          theme="sql_console"
          width="100%"
          height="5rem"
          value={this.props.pplQuery}
          onChange={this.props.updatePPLQueries}
          showPrintMargin={false}
          setOptions={{
            fontSize: "14px",
            showLineNumbers: false,
            showGutter: false,
          }}
          aria-label="Code Editor"
        />
        <EuiSpacer />
        <EuiFlexGroup className="action-container" gutterSize="m">
          <EuiFlexItem className="sql-editor-buttons"
            grow={false}
            onClick={() => this.props.onRun(this.props.pplQuery)}
          >
            <EuiButton fill={true} className="sql-editor-button" >
              Run
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem
            grow={false}
            onClick={() => {
              this.props.updatePPLQueries("");
              this.props.onClear();
            }}
          >
            <EuiButton className="sql-editor-button">
              Clear
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem
            grow={false}
            onClick={() =>
              this.props.onTranslate(this.props.pplQuery)
            }
          >
            <EuiButton className="sql-editor-button" onClick={showModal}>
              Explain
            </EuiButton>
            {modal}
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPanel >
    )
  }
}
