namespace web_api_.net.Dtos
{
    public class SuccessResponseDto<T>
    {
        public int StatusCode { get; set; }
        public T Data { get; set; }

        public SuccessResponseDto(int statusCode, T data)
        {
            StatusCode = statusCode;
            Data = data;
        }
    }

   
}
