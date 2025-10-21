import styled from "styled-components";

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f6fa;
`;

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  width: 320px;
  padding: 2rem;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
`;

export const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
  color: #2f3640;
`;

export const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #dcdde1;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #40739e;
  }
`;

export const Button = styled.button`
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background: #40739e;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #273c75;
  }
`;

export const LinkForgot = styled.div`
    text-decoration: none;
    cursor: grab;
    font-size: 16px;
    margin-top: 20px;
    color: #555;
    font-weight: 600;
    padding-top: 7px;

    &:hover {
        opacity: 0.6;
    }
`