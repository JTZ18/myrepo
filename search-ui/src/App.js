import React from "react";

import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";

import {
  ErrorBoundary,
  Facet,
  SearchProvider,
  SearchBox,
  Results,
  PagingInfo,
  ResultsPerPage,
  Paging,
  Sorting,
  WithSearch
} from "@elastic/react-search-ui";
import { Layout } from "@elastic/react-search-ui-views";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

import {
  buildAutocompleteQueryConfig,
  buildFacetConfigFromConfig,
  buildSearchOptionsFromConfig,
  buildSortOptionsFromConfig,
  getConfig,
  getFacetFields
} from "./config/config-helper";

const { hostIdentifier, searchKey, endpointBase, engineName } = getConfig();
const connector = new ElasticsearchAPIConnector({
  host: "http://localhost:9200",
  index: "cv-transcriptions"
});
// const config = {
//   searchQuery: {
//     facets: buildFacetConfigFromConfig(),
//     ...buildSearchOptionsFromConfig()
//   },
//   autocompleteQuery: buildAutocompleteQueryConfig(),
//   apiConnector: connector,
//   alwaysSearchOnInitialLoad: true
// };

const config = {
  searchQuery: {
    search_fields: {
      generated_text: {
        weight: 3
      },
      duration: {},
      age: {},
      gender: {},
      accent: {}
    },
    result_fields: {
      filename: {
        snippet:{}
      },
      text: {
        snippet:{}
      },
      up_votes: {
        snippet:{}
      },
      down_votes: {
        snippet:{}
      },
      generated_text: {
        snippet: {}
      },
      duration: {
        snippet: {}
      },
      age: {
        snippet: {}
      },
      gender: {
        snippet: {}
      },
      accent: {
        snippet: {}
      }
    },
    disjunctiveFacets: ["duration.keyword", "age.keyword", "gender.keyword", "accent.keyword"],
    facets: {
      "duration.keyword": { type: "value" },
      "age.keyword": { type: "value" },
      "gender.keyword": { type: "value" },
      "accent.keyword": { type: "value" },
    }
  },
  autocompleteQuery: {
    results: {
      resultsPerPage: 5,
      search_fields: {
        "generated_text.suggest": {}
      },
      result_fields: {
        generated_text: {
          snippet: {
            fallback: true
          }
        },
      }
    },
    suggestions: {
      types: {
        results: { fields: ["generated_text"] }
      },
    }
  },
  apiConnector: connector,
  alwaysSearchOnInitialLoad: true
};



export default function App() {
  return (
    <SearchProvider config={config}>
      <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
        {({ wasSearched }) => {
          return (
            <div className="App">
              <ErrorBoundary>
                <Layout
                  header={<SearchBox autocompleteSuggestions={true} />}
                  sideContent={
                    <div>
                      {wasSearched && (
                        <Sorting
                          label={"Sort by"}
                          sortOptions={buildSortOptionsFromConfig()}
                        />
                      )}
                      {getFacetFields().map(field => (
                        <Facet key={field} field={field} label={field} />
                      ))}
                    </div>
                  }
                  bodyContent={
                    <Results
                      titleField={getConfig().titleField}
                      urlField={getConfig().urlField}
                      thumbnailField={getConfig().thumbnailField}
                      shouldTrackClickThrough={true}
                    />
                  }
                  bodyHeader={
                    <React.Fragment>
                      {wasSearched && <PagingInfo />}
                      {wasSearched && <ResultsPerPage />}
                    </React.Fragment>
                  }
                  bodyFooter={<Paging />}
                />
              </ErrorBoundary>
            </div>
          );
        }}
      </WithSearch>
    </SearchProvider>
  );
}
