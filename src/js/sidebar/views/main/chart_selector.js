import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Plus, X } from 'react-feather';
import { newSidebarView } from '../../actions';
import { setActiveChart, deleteChart } from '../../../user/actions';
import { Loader, constants } from '../../../toolbox';

const { color } = constants;

const Container = styled.div`
   display: flex;
   flex-direction: column;
   flex: 1;
   overflow: auto;
`;

const Header = styled.div`
   font-family: "SF Pro Display";
   font-weight: normal;
   font-size: 1.25rem;
   padding: 1em;
   border-bottom: 1px solid ${color.gray[3]};
   color: ${color.gray[6]}
   letter-spacing: 1px;
   text-transform: uppercase;
`;

const ChartButtonContainer = styled.div`
   display: flex;
   flex-direction: column;
`;

const ButtonContainer = styled.div`
   position: relative;
   display: flex;
   justify-content: space-between;
   align-items: center;
   min-height: 4em;
   transition: all 0.15s ease;
   border-left: 8px solid
      ${props => (props.isActive ? color.blue[3] : 'transparent')};
   border-bottom: ${props =>
      props.noBorder ? 'none' : '1px solid ' + color.gray[3]};
   cursor: pointer;
   overflow: auto;

   svg {
      margin: auto;
      color: ${color.gray[6]};
   }

   &:hover {
      background: ${color.gray[1]};
   }
`;

const TextContainer = styled.div`
   display: flex;
   flex-direction: column;
   padding-left: 1em;
`;

const Title = styled.h3`
   font-family: 'SF Pro Display';
   font-weight: 500;
   margin: 0;
`;

const Subtitle = styled.h4`
   font-family: 'SF Pro Display';
   font-weight: 300;
   margin: 0;
   color: ${color.gray[6]};
`;

const DeleteContainer = styled.div`
   position: absolute;
   top: 0;
   bottom: 0;
   right: 0;
   width: 2em;
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
   padding: 0 4px;
   transition: all 0.15s ease;

   &:hover {
      background: ${color.gray[3]};

      svg {
         color: red;
      }
   }
`;

const mapStateToProps = state => {
   return { auth: state.auth };
};

const mapDispatchToProps = dispatch => {
   return {
      newSidebarView: view => dispatch(newSidebarView(view)),
      setActiveChart: (config, name) => dispatch(setActiveChart(config, name)),
      deleteChart: (config, name) => dispatch(deleteChart(config, name)),
   };
};

class ChartSelector extends Component {
   state = {
      loading: {},
   };

   static getDerivedStateFromProps(nextProps, prevState) {
      return {
         loading: {},
      };
   }

   newChart = () => {
      const { auth } = this.props;
      const { loggedIn } = auth;

      this.props.newSidebarView({
         name: loggedIn ? 'chartSelect' : 'login',
         props: {},
         route: loggedIn ? null : 'chartSelect',
      });
   };

   setActive = (config, name) => {
      this.props.setActiveChart(config, name);
      this.setState(state => {
         if (state.loading[name]) {
            return state;
         }
         state.loading[name] = true;
         return state;
      });
   };

   deleteChart(e, name) {
      e.stopPropagation();

      const { auth } = this.props;
      const { config } = auth;

      this.props.deleteChart(config, name);

      this.setState(state => {
         if (state.loading[name]) {
            return state;
         }
         state.loading[name] = true;
         return state;
      });
   }

   getUserCharts = () => {
      const { auth } = this.props;
      const { loading } = this.state;
      const { config } = auth;

      if (!config || !auth.loggedIn) return;
      const { charts, active_chart } = config;
      const chartButtons = [];

      for (let name in charts) {
         const _dept = charts[name];
         const subtitle = _dept.split('_').join(' ');
         const isActive = name === active_chart;

         chartButtons.push(
            <ButtonContainer
               key={name}
               isActive={isActive}
               onClick={isActive ? null : () => this.setActive(config, name)}>
               <TextContainer>
                  <Title>{name}</Title>
                  <Subtitle>{subtitle}</Subtitle>
               </TextContainer>
               <DeleteContainer onClick={e => this.deleteChart(e, name)}>
                  {loading[name] ? <Loader size="small" /> : <X />}
               </DeleteContainer>
            </ButtonContainer>,
         );
      }
      return chartButtons;
   };

   render() {
      return (
         <Container>
            <Header>Flowcharts</Header>
            <ChartButtonContainer>
               {this.getUserCharts()}
               <ButtonContainer noBorder onClick={this.newChart}>
                  <Plus size={30} />
               </ButtonContainer>
            </ChartButtonContainer>
         </Container>
      );
   }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartSelector);
