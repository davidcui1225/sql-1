/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

package org.opensearch.sql.opensearch.planner.logical.rule;

import static com.facebook.presto.matching.Pattern.typeOf;
import static org.opensearch.sql.planner.optimizer.pattern.Patterns.source;

import com.facebook.presto.matching.Capture;
import com.facebook.presto.matching.Captures;
import com.facebook.presto.matching.Pattern;
import lombok.Getter;
import lombok.experimental.Accessors;
import org.opensearch.sql.opensearch.planner.logical.OpenSearchLogicalIndexScan;
import org.opensearch.sql.planner.logical.LogicalLimit;
import org.opensearch.sql.planner.logical.LogicalPlan;
import org.opensearch.sql.planner.logical.LogicalRelation;
import org.opensearch.sql.planner.optimizer.Rule;

@Getter
public class MergeLimitAndRelation implements Rule<LogicalLimit> {

  private final Capture<LogicalRelation> relationCapture;

  @Accessors(fluent = true)
  private final Pattern<LogicalLimit> pattern;

  /**
   * Constructor of MergeLimitAndRelation.
   */
  public MergeLimitAndRelation() {
    this.relationCapture = Capture.newCapture();
    this.pattern = typeOf(LogicalLimit.class)
        .with(source().matching(typeOf(LogicalRelation.class).capturedAs(relationCapture)));
  }

  @Override
  public LogicalPlan apply(LogicalLimit plan, Captures captures) {
    LogicalRelation relation = captures.get(relationCapture);
    return OpenSearchLogicalIndexScan.builder()
        .relationName(relation.getRelationName())
        .offset(plan.getOffset())
        .limit(plan.getLimit())
        .build();
  }
}