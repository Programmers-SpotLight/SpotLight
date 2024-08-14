import Button from "@/components/common/button/Button";

const ReveiwError = () => {
  return (
    <div className="flex flex-col space-y-3 justify-center items-center border border-solid rounded-lg p-3 border-grey3">
      <p className="text-small text-grey4">Review를 불러오는 중에 오류가 발생하였습니다.</p>
      <Button size="small" onClick={() => window.location.reload()}>재시도</Button>
    </div>
  );
};

export default ReveiwError;