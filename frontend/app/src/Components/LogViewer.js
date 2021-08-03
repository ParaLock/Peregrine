import React,  { Fragment } from 'react';
import { List, AutoSizer } from "react-virtualized";
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import _ from 'lodash';

const Line = styled.div`

    font-size: 13px;
    padding-right: 10px;
    padding-left: 10px;
    border-bottom: 1px solid gray;
    &:hover {
        background-color: black;
        color: white;
    }

`;

const SearchBar = styled.div`

    display: flex;
    align-items: center;
    justify-content: flex-end;

`;

const SearchInput = styled.input`

    height: 20px;
    min-width: 200px;
    font-size: 12px;
    padding: 2px 5px;
    border: 1px solid #4e4e4e;
    margin-right: 10px;

`;

class LogViewer extends React.Component {


    constructor(props) {

        super(props);

        this.state = {
            searchVal: "",
            entries: []
        }

        this.searchEnabled = false;
    }

    onSearchChange(e) {

        this.setState({ searchVal: e.target.value }, () => this.search());

    }

    onSearchStart(e) {

        if (e.key === 'Enter') {
            this.searchEnabled = !this.searchEnabled;
            this.search();
        }
    }

    componentDidUpdate(prevProps) {

        if(this.props.updateFlag != prevProps.updateFlag) {

            this.search();
        }

    }

    search() {

        if(this.searchEnabled && this.state.searchVal != "") {

            var newEntries = [];

            var escapedVal = this.state.searchVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            var pattern = new RegExp(escapedVal, "gi");

            this.props.entries.forEach((item) => {

                if(item.toLowerCase().includes(this.state.searchVal.toLowerCase())) {

                    var val = item.replace(pattern, (match) => `<mark>${match}</mark>`);

                    newEntries.push(<span dangerouslySetInnerHTML={{__html: val}} />);
                }
            });

            this.setState({entries: newEntries});

        } else {

            this.setState({entries: this.props.entries});
        }

    }

    renderRow({ index, key, style }) {
        return (
          <Line key={key} style={style}>

            {this.state.entries[index]}

          </Line>
        );
      }

    render() {

        const paddingHeight = 30;
        const paddingWidth = 14;
        const rowHeight = 20;

        return <>
                    <SearchBar>
                        <SearchIcon color={this.searchEnabled ? "primary" : "disabled"}/>
                        <SearchInput
                                    type="text"
                                    placeholder="Search"
                                    onChange={this.onSearchChange.bind(this)}
                                    onKeyDown={this.onSearchStart.bind(this)}
                                    value={this.state.searchVal}
                        />
                    </SearchBar>
                    <AutoSizer style={{ height: "200px" }}>
                        {({ width, height }) => {
                            return <List
                                width={width - paddingWidth}
                                height={height - paddingHeight}
                                rowHeight={rowHeight}
                                rowRenderer={this.renderRow.bind(this)}
                                rowCount={this.state.entries.length}
                            />
                        }}
                    </AutoSizer>
                </>

    }
}

export default LogViewer;