"use client";
import ClienteList from '../components/ClienteList/ClienteList';
import UploadForm from '../components/UploadForm';
import { RecoilRoot } from 'recoil';

const UploadPage = () => {
  return (
    <div>
      <RecoilRoot>
        <ClienteList />
        <UploadForm />
      </RecoilRoot>
    </div>
  );
};

export default UploadPage;